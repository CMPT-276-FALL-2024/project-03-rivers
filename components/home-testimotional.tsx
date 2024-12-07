import { AnimatedTestimonials } from "./ui/animated-testimonials";


export function HomeTestimonials() {
  const testimonials = [
    {
      quote:
        "User friendly interface that allows you to easily search for recipes by keyword, ingredient, cuisine genre, or dietary requirements.",
      name: "Recipe Search",
      designation: "User-friendly Search",
      src: "/images/home/search.png",
    },
    {
      quote:
        "Displays the ingredients of a dish and shows the working process. It is also designed for easy scheduling and nutritional value page.",
      name: "Recipe Result",
      designation: "Specific Recipe Details",
      src: "/images/home/result.png",
    },
    {
      quote:
        "Check the nutritional balance of meals and is useful for health management and diet-conscious use. Calories per serving and percentages of key nutrients are specifically displayed.",
      name: "Nutrition Facts",
      designation: "Details of Nutritional Value",
      src: "/images/home/nutrition.png",
    },
    {
      quote:
        "Useful tool for those who wish to plan and manage your cooking schedules. It provides support for efficient cooking and preparation. You can check it on your Google Calendar as well.",
      name: "View Plans",
      designation: "Sync with Google Calendar",
      src: "/images/home/calendar.png",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
