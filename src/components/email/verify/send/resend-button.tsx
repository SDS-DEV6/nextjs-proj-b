import { useFormStatus } from "react-dom";

export default function ResendButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-gray-200 py-2 rounded w-full disabled:bg-slate-50 disabled:text-slate-500"
      disabled={pending ? true : false}
    >
      Resend verification link {pending ? "..." : ""}
    </button>
  );
}
