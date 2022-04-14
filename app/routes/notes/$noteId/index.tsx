import { Link, Form, useOutletContext } from "@remix-run/react";
import type { NoteLoaderData } from "../$noteId";

export default function NoteDetailsPage() {
  const data = useOutletContext() as NoteLoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>
      <p className="py-6">{data.note.body}</p>
      <hr className="my-4" />
      <div className="flex flex-row justify-between">
        <Link className="text-blue-500 underline" to={data.editPath}>
          Edit
        </Link>
        <Form method="post">
          <button
            type="submit"
            className="rounded bg-red-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}
