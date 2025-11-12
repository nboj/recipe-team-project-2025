import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    sections: [
      { type: "hero", title: "Cook smarter", subtitle: "DB-powered soon" },
      {
        type: "row",
        title: "Trending",
        items: [
          { id: 1, title: "Apple Pie", description: "Classic" },
          { id: 2, title: "Pumpkin Pie", description: "Fall vibes" },
          { id: 3, title: "Garlic Butter Pasta", description: "Weeknight win" },
        ],
      },
      { type: "text", markdown: "Tip: Preheat the oven and taste as you go." },
      { type: "row", title: "New Arrivals", items: [] }, // blanks allowed
      { type: "hero" },                                   // blanks allowed
    ],
  });
}
