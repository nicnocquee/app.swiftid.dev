import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Note } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";
import { appendPathToUrl } from "~/utils";

export type NoteLoaderData = {
  note: Note;
  editPath: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<NoteLoaderData>({
    note,
    editPath: `${new URL(appendPathToUrl(request.url, "/edit")).pathname}`,
  });
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as NoteLoaderData;
  const context = data;

  return <Outlet context={context} />;
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
