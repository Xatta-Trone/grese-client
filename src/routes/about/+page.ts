import { dev } from '$app/environment';
import { user } from "$lib/services/auth";
import { redirect } from "@sveltejs/kit";

// // we don't need any JS on this page, though we'll load
// // it in dev so that we get hot module replacement
// export const csr = dev;

// // since there's no dynamic data here, we can prerender
// // it so that it gets served as a static asset in production
// export const prerender = true;

export const load = () => {
  console.log("first");
  user.subscribe((value) => {
    console.log(value);
    if (value == null) {
      throw redirect(301, "/");
    }
  });
};
