import Link from "next/link";

interface Props {
  text: string;
  linkText: string;
  href: string;
}

export default function AuthFooter({
  text,
  linkText,
  href,
}: Props) {
  return (
    <p
      className="
        text-center
        text-gray-600
        transition-colors
        duration-300

        dark:text-slate-400
      "
    >
      {text}

      <Link
        href={href}
        className="
          ml-2
          font-semibold
          text-teal-600
          transition-colors
          duration-300

          hover:text-teal-700

          dark:text-teal-400
          dark:hover:text-teal-300
        "
      >
        {linkText}
      </Link>
    </p>
  );
}