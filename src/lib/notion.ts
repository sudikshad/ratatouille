const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_RECIPES_PAGE_ID = process.env.NOTION_RECIPES_PAGE_ID;

interface NotionBlock {
  id: string;
  type: string;
  child_page?: { title: string };
  heading_2?: { rich_text: Array<{ plain_text: string }> };
  to_do?: { rich_text: Array<{ plain_text: string }> };
  bulleted_list_item?: { rich_text: Array<{ plain_text: string }> };
  paragraph?: { rich_text: Array<{ plain_text: string }> };
}

interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients: string[];
  steps: string[];
  notionUrl: string;
}

async function fetchBlocks(blockId: string): Promise<NotionBlock[]> {
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`,
    {
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status}`);
  }

  const data = await res.json();
  return data.results;
}

function extractText(block: NotionBlock): string {
  if (block.to_do?.rich_text) {
    return block.to_do.rich_text.map((t) => t.plain_text).join("");
  }
  if (block.bulleted_list_item?.rich_text) {
    return block.bulleted_list_item.rich_text.map((t) => t.plain_text).join("");
  }
  if (block.paragraph?.rich_text) {
    return block.paragraph.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

async function fetchRecipeContent(
  pageId: string
): Promise<{ ingredients: string[]; steps: string[] }> {
  const blocks = await fetchBlocks(pageId);

  const ingredients: string[] = [];
  const steps: string[] = [];
  let currentSection = "";

  for (const block of blocks) {
    if (block.type === "heading_2") {
      const text =
        block.heading_2?.rich_text.map((t) => t.plain_text).join("") || "";
      currentSection = text.toLowerCase();
    } else if (block.type === "to_do" || block.type === "bulleted_list_item") {
      const text = extractText(block).trim();
      if (text) {
        if (
          currentSection.includes("input") ||
          currentSection.includes("ingredient")
        ) {
          ingredients.push(text);
        } else if (
          currentSection.includes("step") ||
          currentSection.includes("instruction") ||
          currentSection.includes("method")
        ) {
          steps.push(text);
        } else if (block.type === "to_do") {
          // Default: to_do items are ingredients
          ingredients.push(text);
        } else {
          // Default: bullets after ingredients are steps
          steps.push(text);
        }
      }
    }
  }

  return { ingredients, steps };
}

export async function fetchNotionRecipes(): Promise<Recipe[]> {
  if (!NOTION_TOKEN || !NOTION_RECIPES_PAGE_ID) {
    throw new Error("Notion credentials not configured");
  }

  const blocks = await fetchBlocks(NOTION_RECIPES_PAGE_ID);
  const recipes: Recipe[] = [];
  let currentCategory = "Uncategorized";

  for (const block of blocks) {
    if (block.type === "heading_2") {
      currentCategory =
        block.heading_2?.rich_text.map((t) => t.plain_text).join("") ||
        "Uncategorized";
    } else if (block.type === "child_page" && block.child_page?.title) {
      const { ingredients, steps } = await fetchRecipeContent(block.id);

      recipes.push({
        id: block.id,
        title: block.child_page.title,
        category: currentCategory.trim(),
        ingredients,
        steps,
        notionUrl: `https://notion.so/${block.id.replace(/-/g, "")}`,
      });
    }
  }

  return recipes;
}

export async function fetchRecipeList(): Promise<
  Array<{ id: string; title: string; category: string }>
> {
  if (!NOTION_TOKEN || !NOTION_RECIPES_PAGE_ID) {
    throw new Error("Notion credentials not configured");
  }

  const blocks = await fetchBlocks(NOTION_RECIPES_PAGE_ID);
  const recipes: Array<{ id: string; title: string; category: string }> = [];
  let currentCategory = "Uncategorized";

  for (const block of blocks) {
    if (block.type === "heading_2") {
      currentCategory =
        block.heading_2?.rich_text.map((t) => t.plain_text).join("") ||
        "Uncategorized";
    } else if (block.type === "child_page" && block.child_page?.title) {
      recipes.push({
        id: block.id,
        title: block.child_page.title,
        category: currentCategory.trim(),
      });
    }
  }

  return recipes;
}
