interface PageIllustrationProps {
  variant: "kitchen" | "vegetables" | "cookbook" | "shopping" | "chef";
  className?: string;
}

// Cookbook color palette
const COLORS = {
  purple: "#7B4B94",    // eggplant
  orange: "#E07A5F",    // terracotta
  green: "#81B29A",     // herb
  yellow: "#F2CC8F",    // butter
  brown: "#8B5A2B",     // warm brown
};

export function PageIllustration({ variant, className = "" }: PageIllustrationProps) {
  return (
    <div className={`pointer-events-none mt-16 ${className}`}>
      <svg
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto opacity-40"
        preserveAspectRatio="xMidYMax slice"
      >
        {variant === "kitchen" && <KitchenIllustration />}
        {variant === "vegetables" && <VegetablesIllustration />}
        {variant === "cookbook" && <CookbookIllustration />}
        {variant === "shopping" && <ShoppingIllustration />}
        {variant === "chef" && <ChefIllustration />}
      </svg>
    </div>
  );
}

function KitchenIllustration() {
  return (
    <g strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Whisk */}
      <g transform="translate(100, 40)" stroke={COLORS.brown}>
        <path d="M20 0 L20 60" />
        <path d="M15 60 Q10 100 5 140 Q0 160 20 160 Q40 160 35 140 Q30 100 25 60" />
        <path d="M20 60 Q15 100 20 140" />
        <path d="M20 60 Q25 100 20 140" />
      </g>

      {/* Spatula */}
      <g transform="translate(220, 50)" stroke={COLORS.orange}>
        <rect x="15" y="0" width="10" height="70" rx="2" />
        <path d="M10 70 L30 70 L35 100 Q35 120 20 120 Q5 120 5 100 L10 70" />
      </g>

      {/* Pan */}
      <g transform="translate(350, 80)" stroke={COLORS.purple}>
        <ellipse cx="50" cy="80" rx="50" ry="15" />
        <path d="M0 80 L0 60 Q0 30 50 30 Q100 30 100 60 L100 80" />
        <path d="M100 70 L160 60" />
        <ellipse cx="160" cy="60" rx="10" ry="5" />
      </g>

      {/* Knife */}
      <g transform="translate(550, 30)" stroke={COLORS.brown}>
        <rect x="0" y="0" width="15" height="50" rx="3" />
        <path d="M0 50 L0 150 Q7.5 155 15 150 L15 50" />
        <path d="M15 50 L20 50 L20 150 Q7.5 160 0 150" />
      </g>

      {/* Cutting board */}
      <g transform="translate(650, 100)" stroke={COLORS.yellow}>
        <rect x="0" y="0" width="120" height="80" rx="5" />
        <rect x="10" y="10" width="100" height="60" rx="3" />
        <circle cx="110" cy="20" r="8" />
      </g>

      {/* Pot */}
      <g transform="translate(850, 40)" stroke={COLORS.orange}>
        <ellipse cx="60" cy="120" rx="60" ry="15" />
        <path d="M0 120 L0 60 Q0 30 60 30 Q120 30 120 60 L120 120" />
        <ellipse cx="60" cy="30" rx="60" ry="12" />
        <path d="M-10 70 L0 70" />
        <path d="M120 70 L130 70" />
        <ellipse cx="60" cy="15" rx="55" ry="10" />
        <circle cx="60" cy="5" r="8" />
      </g>

      {/* Herb sprig */}
      <g transform="translate(1050, 60)" stroke={COLORS.green}>
        <path d="M20 140 Q20 100 25 60" />
        <ellipse cx="15" cy="55" rx="12" ry="6" transform="rotate(-30 15 55)" />
        <ellipse cx="30" cy="50" rx="12" ry="6" transform="rotate(30 30 50)" />
        <ellipse cx="12" cy="40" rx="10" ry="5" transform="rotate(-40 12 40)" />
        <ellipse cx="32" cy="35" rx="10" ry="5" transform="rotate(40 32 35)" />
        <ellipse cx="18" cy="25" rx="8" ry="4" transform="rotate(-30 18 25)" />
        <ellipse cx="28" cy="22" rx="8" ry="4" transform="rotate(30 28 22)" />
      </g>
    </g>
  );
}

function VegetablesIllustration() {
  return (
    <g strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Tomato */}
      <g transform="translate(80, 60)" stroke={COLORS.orange}>
        <circle cx="40" cy="60" r="40" />
        <path d="M25 25 Q40 15 55 25" stroke={COLORS.green} />
        <path d="M40 20 L40 5" stroke={COLORS.green} />
        <path d="M35 8 Q40 0 45 8" stroke={COLORS.green} />
      </g>

      {/* Eggplant/Aubergine */}
      <g transform="translate(200, 30)" stroke={COLORS.purple}>
        <path d="M30 20 Q60 20 60 60 Q60 120 40 140 Q20 160 20 120 Q0 80 0 60 Q0 20 30 20" />
        <path d="M20 20 Q30 0 40 10 Q50 0 55 15" stroke={COLORS.green} />
        <path d="M30 15 L32 5" stroke={COLORS.green} />
      </g>

      {/* Carrot */}
      <g transform="translate(320, 40)" stroke={COLORS.orange}>
        <path d="M20 30 Q35 30 40 60 Q50 120 30 160 Q25 170 20 160 Q0 120 10 60 Q15 30 20 30" />
        <path d="M15 30 Q20 10 25 15" stroke={COLORS.green} />
        <path d="M20 30 Q25 5 30 12" stroke={COLORS.green} />
        <path d="M25 30 Q32 15 35 22" stroke={COLORS.green} />
      </g>

      {/* Onion */}
      <g transform="translate(440, 70)" stroke={COLORS.yellow}>
        <ellipse cx="35" cy="50" rx="35" ry="45" />
        <path d="M35 5 L35 -10" stroke={COLORS.green} />
        <path d="M20 90 Q35 100 50 90" />
        <path d="M10 50 Q35 30 60 50" />
      </g>

      {/* Garlic */}
      <g transform="translate(560, 80)" stroke={COLORS.yellow}>
        <path d="M30 20 Q50 20 50 50 Q50 80 30 90 Q10 80 10 50 Q10 20 30 20" />
        <path d="M20 45 Q30 35 40 45" />
        <path d="M30 15 L30 5" />
        <path d="M25 10 Q30 5 35 10" />
      </g>

      {/* Bell pepper */}
      <g transform="translate(660, 40)" stroke={COLORS.orange}>
        <path d="M30 30 Q60 30 60 70 Q65 130 40 150 Q15 130 15 70 Q15 30 30 30" />
        <path d="M30 30 Q25 10 35 10 Q45 10 40 30" stroke={COLORS.green} />
        <path d="M35 10 L35 0" stroke={COLORS.green} />
        <path d="M25 60 Q35 50 45 60" />
      </g>

      {/* Mushroom */}
      <g transform="translate(780, 70)" stroke={COLORS.brown}>
        <ellipse cx="35" cy="45" rx="35" ry="25" />
        <path d="M25 70 L25 110" />
        <path d="M45 70 L45 110" />
        <ellipse cx="35" cy="110" rx="12" ry="5" />
      </g>

      {/* Leafy greens */}
      <g transform="translate(900, 30)" stroke={COLORS.green}>
        <path d="M40 140 L40 80" />
        <path d="M40 80 Q20 60 30 30 Q40 10 50 30 Q60 60 40 80" />
        <path d="M35 90 Q15 80 20 60" />
        <path d="M45 90 Q65 80 60 60" />
        <path d="M40 50 Q30 40 35 30" />
        <path d="M40 50 Q50 40 45 30" />
      </g>

      {/* Lemon slice */}
      <g transform="translate(1020, 80)" stroke={COLORS.yellow}>
        <circle cx="40" cy="50" r="40" />
        <circle cx="40" cy="50" r="30" />
        <path d="M40 20 L40 50" />
        <path d="M40 50 L60 30" />
        <path d="M40 50 L70 50" />
        <path d="M40 50 L60 70" />
        <path d="M40 50 L40 80" />
        <path d="M40 50 L20 70" />
        <path d="M40 50 L10 50" />
        <path d="M40 50 L20 30" />
      </g>
    </g>
  );
}

function CookbookIllustration() {
  return (
    <g strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Open book 1 */}
      <g transform="translate(80, 40)" stroke={COLORS.brown}>
        <path d="M60 10 L60 120" />
        <path d="M0 20 Q30 10 60 20 L60 130 Q30 120 0 130 L0 20" />
        <path d="M120 20 Q90 10 60 20 L60 130 Q90 120 120 130 L120 20" />
        <path d="M10 40 L50 40" stroke={COLORS.purple} />
        <path d="M10 55 L45 55" stroke={COLORS.purple} />
        <path d="M10 70 L50 70" stroke={COLORS.purple} />
        <path d="M70 40 L110 40" stroke={COLORS.purple} />
        <path d="M70 55 L105 55" stroke={COLORS.purple} />
        <path d="M70 70 L110 70" stroke={COLORS.purple} />
      </g>

      {/* Recipe card */}
      <g transform="translate(280, 50)" stroke={COLORS.yellow}>
        <rect x="0" y="0" width="80" height="110" rx="3" />
        <path d="M10 20 L70 20" stroke={COLORS.orange} />
        <path d="M10 35 L60 35" stroke={COLORS.orange} />
        <path d="M10 50 L65 50" stroke={COLORS.orange} />
        <path d="M10 65 L55 65" stroke={COLORS.orange} />
        <circle cx="60" cy="90" r="12" stroke={COLORS.green} />
        <path d="M55 85 L60 90 L65 82" stroke={COLORS.green} />
      </g>

      {/* Stack of books */}
      <g transform="translate(440, 60)">
        <rect x="0" y="80" width="100" height="15" rx="2" stroke={COLORS.purple} />
        <rect x="5" y="60" width="90" height="15" rx="2" stroke={COLORS.orange} />
        <rect x="0" y="40" width="95" height="15" rx="2" stroke={COLORS.green} />
        <rect x="8" y="20" width="85" height="15" rx="2" stroke={COLORS.brown} />
        <path d="M20 80 L20 95" stroke={COLORS.purple} />
        <path d="M25 60 L25 75" stroke={COLORS.orange} />
        <path d="M18 40 L18 55" stroke={COLORS.green} />
      </g>

      {/* Handwritten recipe */}
      <g transform="translate(620, 40)" stroke={COLORS.yellow}>
        <rect x="0" y="0" width="90" height="120" rx="2" />
        <path d="M10 20 Q25 18 40 20 Q55 22 70 20" stroke={COLORS.brown} />
        <path d="M10 35 Q30 33 50 35 Q65 37 80 35" stroke={COLORS.brown} />
        <path d="M10 50 Q20 48 35 50 Q50 52 60 50" stroke={COLORS.brown} />
        <path d="M10 65 Q35 63 55 65 Q70 67 80 65" stroke={COLORS.brown} />
        <path d="M10 80 Q25 78 45 80" stroke={COLORS.brown} />
        <path d="M70 100 Q80 95 75 85 Q70 80 78 75" stroke={COLORS.purple} />
      </g>

      {/* Index card box */}
      <g transform="translate(800, 50)" stroke={COLORS.brown}>
        <rect x="0" y="20" width="100" height="80" rx="3" />
        <rect x="5" y="15" width="90" height="10" rx="2" />
        <rect x="10" y="10" width="80" height="10" rx="2" />
        <path d="M50 30 L50 90" stroke={COLORS.orange} />
        <path d="M20 50 L40 50" stroke={COLORS.orange} />
        <path d="M60 50 L80 50" stroke={COLORS.orange} />
      </g>

      {/* Pencil */}
      <g transform="translate(980, 70)" stroke={COLORS.yellow}>
        <rect x="0" y="0" width="10" height="80" rx="1" />
        <path d="M0 80 L5 95 L10 80" stroke={COLORS.orange} />
        <rect x="0" y="0" width="10" height="15" stroke={COLORS.purple} />
      </g>

      {/* Bookmark */}
      <g transform="translate(1050, 40)" stroke={COLORS.orange}>
        <path d="M0 0 L30 0 L30 100 L15 85 L0 100 L0 0" />
        <path d="M8 20 L22 20" />
        <path d="M8 35 L22 35" />
      </g>
    </g>
  );
}

function ShoppingIllustration() {
  return (
    <g strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Shopping bag */}
      <g transform="translate(80, 20)" stroke={COLORS.brown}>
        <path d="M10 50 L10 140 Q10 150 20 150 L80 150 Q90 150 90 140 L90 50" />
        <path d="M0 50 L100 50" />
        <path d="M25 50 L25 30 Q25 10 50 10 Q75 10 75 30 L75 50" />
        <ellipse cx="35" cy="45" rx="15" ry="8" stroke={COLORS.green} />
        <path d="M55 30 L60 45" stroke={COLORS.orange} />
        <path d="M65 35 L70 50" stroke={COLORS.green} />
      </g>

      {/* Grocery list */}
      <g transform="translate(240, 30)" stroke={COLORS.yellow}>
        <rect x="0" y="0" width="70" height="100" rx="2" />
        <path d="M10 20 L15 25 L25 15" stroke={COLORS.green} />
        <path d="M30 20 L60 20" stroke={COLORS.brown} />
        <path d="M10 40 L15 45 L25 35" stroke={COLORS.green} />
        <path d="M30 40 L55 40" stroke={COLORS.brown} />
        <path d="M10 60 L15 65 L25 55" stroke={COLORS.green} />
        <path d="M30 60 L50 60" stroke={COLORS.brown} />
        <circle cx="17" cy="80" r="6" stroke={COLORS.purple} />
        <path d="M30 80 L60 80" stroke={COLORS.brown} />
      </g>

      {/* Basket */}
      <g transform="translate(400, 40)" stroke={COLORS.brown}>
        <path d="M0 60 L20 120 L100 120 L120 60" />
        <path d="M0 60 L120 60" />
        <path d="M-5 60 Q60 20 125 60" />
        <path d="M30 60 L30 120" />
        <path d="M60 60 L60 120" />
        <path d="M90 60 L90 120" />
      </g>

      {/* Produce */}
      <g transform="translate(580, 60)">
        <circle cx="25" cy="60" r="25" stroke={COLORS.orange} />
        <circle cx="65" cy="70" r="20" stroke={COLORS.orange} />
        <ellipse cx="45" cy="30" rx="30" ry="15" stroke={COLORS.green} />
        <path d="M45 15 L45 5" stroke={COLORS.green} />
      </g>

      {/* Milk carton */}
      <g transform="translate(700, 40)" stroke={COLORS.purple}>
        <rect x="10" y="30" width="40" height="80" rx="2" />
        <path d="M10 30 L20 10 L40 10 L50 30" />
        <path d="M10 50 L50 50" />
        <path d="M20 60 L40 60" />
        <path d="M20 75 L40 75" />
      </g>

      {/* Bread */}
      <g transform="translate(820, 50)" stroke={COLORS.yellow}>
        <ellipse cx="40" cy="70" rx="40" ry="20" />
        <path d="M0 70 L0 40 Q0 20 40 20 Q80 20 80 40 L80 70" />
        <path d="M15 35 Q40 25 65 35" stroke={COLORS.brown} />
        <path d="M10 50 Q40 40 70 50" stroke={COLORS.brown} />
      </g>

      {/* Jar */}
      <g transform="translate(960, 40)" stroke={COLORS.green}>
        <rect x="5" y="30" width="50" height="80" rx="5" />
        <rect x="10" y="20" width="40" height="15" rx="2" stroke={COLORS.brown} />
        <path d="M15 25 L45 25" stroke={COLORS.brown} />
        <ellipse cx="30" cy="70" rx="15" ry="10" />
      </g>

      {/* Apple */}
      <g transform="translate(1080, 70)" stroke={COLORS.orange}>
        <circle cx="30" cy="50" r="30" />
        <path d="M30 20 L35 5" stroke={COLORS.brown} />
        <path d="M35 10 Q45 5 50 15" stroke={COLORS.green} />
      </g>
    </g>
  );
}

function ChefIllustration() {
  return (
    <g strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Chef hat */}
      <g transform="translate(100, 20)" stroke={COLORS.purple}>
        <ellipse cx="50" cy="100" rx="45" ry="10" />
        <path d="M5 100 L5 70 Q5 30 25 30 Q30 10 50 10 Q70 10 75 30 Q95 30 95 70 L95 100" />
        <path d="M25 30 Q25 50 50 50 Q75 50 75 30" />
      </g>

      {/* Sparkle 1 */}
      <g transform="translate(250, 40)" stroke={COLORS.yellow}>
        <path d="M20 0 L20 40" />
        <path d="M0 20 L40 20" />
        <path d="M5 5 L35 35" />
        <path d="M35 5 L5 35" />
      </g>

      {/* Sparkle 2 (smaller) */}
      <g transform="translate(350, 80)" stroke={COLORS.orange}>
        <path d="M15 0 L15 30" />
        <path d="M0 15 L30 15" />
        <path d="M5 5 L25 25" />
        <path d="M25 5 L5 25" />
      </g>

      {/* Rolling pin */}
      <g transform="translate(420, 50)" stroke={COLORS.brown}>
        <ellipse cx="15" cy="50" rx="15" ry="10" />
        <rect x="15" y="40" width="100" height="20" rx="5" />
        <ellipse cx="115" cy="50" rx="15" ry="10" />
        <path d="M0 50 L-20 40" />
        <path d="M130 50 L150 40" />
      </g>

      {/* Mixing bowl with whisk */}
      <g transform="translate(620, 40)" stroke={COLORS.purple}>
        <ellipse cx="50" cy="90" rx="50" ry="15" />
        <path d="M0 90 Q-5 50 50 50 Q105 50 100 90" />
        <path d="M70 50 L80 20 L85 0" stroke={COLORS.brown} />
        <path d="M75 35 Q85 40 80 50" stroke={COLORS.brown} />
        <path d="M78 30 Q88 32 85 42" stroke={COLORS.brown} />
      </g>

      {/* Steam wisps */}
      <g transform="translate(800, 60)" stroke={COLORS.orange}>
        <path d="M10 80 Q5 60 15 50 Q10 35 20 20" />
        <path d="M30 80 Q35 55 25 40 Q30 25 25 10" />
        <path d="M50 80 Q45 65 55 50 Q50 30 55 15" />
      </g>

      {/* Sparkle 3 */}
      <g transform="translate(900, 50)" stroke={COLORS.green}>
        <path d="M20 0 L20 40" />
        <path d="M0 20 L40 20" />
        <path d="M5 5 L35 35" />
        <path d="M35 5 L5 35" />
      </g>

      {/* Measuring cups */}
      <g transform="translate(1000, 50)">
        <path d="M0 30 L0 80 Q0 90 15 90 L35 90 Q50 90 50 80 L50 30" stroke={COLORS.green} />
        <ellipse cx="25" cy="30" rx="25" ry="8" stroke={COLORS.green} />
        <path d="M50 50 L65 50 L65 55 L50 55" stroke={COLORS.green} />
        <path d="M70 50 L70 90 Q70 95 80 95 L95 95 Q105 95 105 90 L105 50" stroke={COLORS.yellow} />
        <ellipse cx="87" cy="50" rx="18" ry="6" stroke={COLORS.yellow} />
      </g>
    </g>
  );
}
