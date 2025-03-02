import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const destinations = [
  {
    city: "Paris",
    country: "France",
    clues: [
      "This city is home to a famous tower that sparkles every night.",
      "Known as the 'City of Love' and a hub for fashion and art."
    ],
    funFact: [
      "The Eiffel Tower was supposed to be dismantled after 20 years but was saved because it was useful for radio transmissions!",
      "Paris has only one stop sign in the entire city—most intersections rely on priority-to-the-right rules."
    ],
    trivia: [
      "This city is famous for its croissants and macarons. Bon appétit!",
      "Paris was originally a Roman city called Lutetia."
    ]
  },
  {
    city: "Tokyo",
    country: "Japan",
    clues: [
      "This city has the busiest pedestrian crossing in the world.",
      "You can visit an entire district dedicated to anime, manga, and gaming."
    ],
    funFact: [
      "Tokyo was originally a small fishing village called Edo before becoming the bustling capital it is today!",
      "More than 14 million people live in Tokyo, making it one of the most populous cities in the world."
    ],
    trivia: [
      "The city has over 160,000 restaurants, more than any other city in the world.",
      "Tokyo’s subway system is so efficient that train delays of just a few minutes come with formal apologies."
    ]
  },

  {
    city: "New York",
    country: "USA",
    clues: [
      "This city is home to the Statue of Liberty and Times Square.",
      "It is known as the 'Big Apple' and never sleeps."
    ],
    funFact: [
      "More than 800 languages are spoken in this city, making it one of the most linguistically diverse places in the world.",
      "Central Park is larger than the entire country of Monaco!"
    ],
    trivia: [
      "This city has the largest subway system in the world by number of stations.",
      "It was the first capital of the United States in 1789."
    ]
  },
  {
    city: "Sydney",
    country: "Australia",
    clues: [
      "This city has a famous Opera House with a sail-like design.",
      "You can climb its massive Harbour Bridge for a great view."
    ],
    funFact: [
      "Sydney has over 100 beaches, including Bondi Beach.",
      "It was the first major city in the world to celebrate New Year's Eve fireworks."
    ],
    trivia: [
      "Sydney’s Opera House took 14 years to build and was over budget by 1,400%.",
      "More than 250 languages are spoken in Sydney."
    ]
  },
  {
    city: "Cairo",
    country: "Egypt",
    clues: [
      "This city is home to the only remaining Wonder of the Ancient World.",
      "It has a river that is the longest in the world."
    ],
    funFact: [
      "The Pyramids of Giza were built more than 4,500 years ago.",
      "Cairo is known as 'The City of a Thousand Minarets' because of its many mosques."
    ],
    trivia: [
      "The Great Pyramid of Giza was the tallest structure in the world for over 3,800 years.",
      "Egyptians invented one of the first forms of writing: hieroglyphics."
    ]
  }
];

async function main() {
  for (const destination of destinations) {
    await prisma.destination.create({
      data: destination,
    });
  }
  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
