const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_RECIPES_PAGE_ID = process.env.NOTION_RECIPES_PAGE_ID;

interface NotionRichText {
  plain_text: string;
  annotations?: { bold?: boolean };
}

interface NotionBlock {
  id: string;
  type: string;
  child_page?: { title: string };
  heading_1?: { rich_text: NotionRichText[] };
  heading_2?: { rich_text: NotionRichText[] };
  heading_3?: { rich_text: NotionRichText[] };
  paragraph?: { rich_text: NotionRichText[] };
  to_do?: { rich_text: NotionRichText[] };
  bulleted_list_item?: { rich_text: NotionRichText[] };
  numbered_list_item?: { rich_text: NotionRichText[] };
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

function getPlainText(richText: NotionRichText[] | undefined): string {
  if (!richText) return "";
  return richText.map((t) => t.plain_text).join("").trim();
}

function isBoldParagraph(block: NotionBlock): boolean {
  if (block.type !== "paragraph") return false;
  const richText = block.paragraph?.rich_text;
  if (!richText || richText.length === 0) return false;
  // Check if first text segment is bold
  return richText[0]?.annotations?.bold === true;
}

function detectSection(text: string): "ingredients" | "steps" | "other" | null {
  const lower = text.toLowerCase();

  // Ingredients section markers
  const ingredientMarkers = [
    "ingredient", "input", "for the pot", "for the sauce", "for the",
    "stir in", "for serving", "you'll need", "what you need",
    "⭐"
  ];

  // Steps/instructions section markers
  const stepMarkers = [
    "instruction", "step", "method", "direction", "how to",
    "procedure", "🔥", "prep", "cook"
  ];

  // Check if it's a numbered step header (like "1️⃣ Prep")
  if (/^[0-9️⃣①-⑳\d]+/.test(text)) {
    return "steps";
  }

  for (const marker of ingredientMarkers) {
    if (lower.includes(marker)) return "ingredients";
  }

  for (const marker of stepMarkers) {
    if (lower.includes(marker)) return "steps";
  }

  return null;
}

function extractText(block: NotionBlock): string {
  const textSources = [
    block.to_do?.rich_text,
    block.bulleted_list_item?.rich_text,
    block.numbered_list_item?.rich_text,
    block.paragraph?.rich_text,
  ];

  for (const source of textSources) {
    const text = getPlainText(source);
    if (text) return text;
  }

  return "";
}

async function fetchRecipeContent(
  pageId: string
): Promise<{ ingredients: string[]; steps: string[] }> {
  const blocks = await fetchBlocks(pageId);

  const ingredients: string[] = [];
  const steps: string[] = [];
  let currentSection: "ingredients" | "steps" | "other" = "other";
  let foundIngredients = false;
  let foundSteps = false;

  for (const block of blocks) {
    // Check headings for section markers
    if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
      const headingText = getPlainText(
        block.heading_1?.rich_text || block.heading_2?.rich_text || block.heading_3?.rich_text
      );
      const section = detectSection(headingText);
      if (section === "ingredients") {
        currentSection = "ingredients";
        foundIngredients = true;
        continue;
      } else if (section === "steps") {
        currentSection = "steps";
        foundSteps = true;
        continue;
      }
    }

    // Check bold paragraphs as section headers
    if (isBoldParagraph(block)) {
      const text = getPlainText(block.paragraph?.rich_text);
      const section = detectSection(text);
      if (section === "ingredients") {
        currentSection = "ingredients";
        foundIngredients = true;
        continue;
      } else if (section === "steps") {
        currentSection = "steps";
        foundSteps = true;
        continue;
      }
    }

    // Extract content from list items
    if (block.type === "to_do" || block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const text = extractText(block);
      if (!text) continue;

      // If we haven't found explicit sections, use heuristics
      if (!foundIngredients && !foundSteps) {
        // to_do items are typically ingredients
        if (block.type === "to_do") {
          ingredients.push(text);
        } else {
          // bullets before any section marker go to ingredients
          // bullets after to_do items go to steps
          if (ingredients.length > 0) {
            steps.push(text);
          } else {
            ingredients.push(text);
          }
        }
      } else {
        // We have explicit sections
        if (currentSection === "ingredients") {
          ingredients.push(text);
        } else if (currentSection === "steps") {
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
      currentCategory = getPlainText(block.heading_2?.rich_text) || "Uncategorized";
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
      currentCategory = getPlainText(block.heading_2?.rich_text) || "Uncategorized";
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
