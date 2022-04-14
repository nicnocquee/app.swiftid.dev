import { Link, Form, useOutletContext } from "@remix-run/react";
import { type ActionFunction, redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { deleteNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import type { NoteLoaderData } from "../$noteId";

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

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
            onClick={(e) => {
              if (
                !window.confirm("Are you sure you want to delete this note?")
              ) {
                e.preventDefault();
              }
            }}
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
