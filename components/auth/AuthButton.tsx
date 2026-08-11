interface Props {
  title: string;
  disabled?: boolean;
}

export default function AuthButton({ title, disabled }: Props) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="
        w-full
        rounded-xl
        bg-teal-600
        py-3.5
        font-semibold
        text-white
        shadow-md
        transition-all
        duration-300

        hover:bg-teal-700
        hover:shadow-xl

        active:scale-95

        disabled:cursor-not-allowed
        disabled:opacity-60

        dark:bg-teal-600
        dark:hover:bg-teal-500
      "
    >
      {title}
    </button>
  );
}