import { user, type UserInterface } from "$lib/services/auth";
import { redirectHelper } from '$lib/utils/helpers';
import type { PageServerLoad } from "../$types";

// // we don't need any JS on this page, though we'll load
// // it in dev so that we get hot module replacement
// export const csr = dev;

// // since there's no dynamic data here, we can prerender
// // it so that it gets served as a static asset in production
// export const prerender = true;

let u: UserInterface | null;

user.subscribe((value) => {
  console.log("value from about page", value);
  u = value
  // if (value == null) {
  //   redirectHelper('/')
  // }
});


export const load: PageServerLoad = async ({ locals, parent }) => {
  await parent();
  console.log("about page", locals.user);

  return {
    user: u
  }
};
