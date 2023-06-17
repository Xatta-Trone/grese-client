/** @format */
import { user } from "$lib/services/auth";
import { redirectHelper } from "$lib/utils/helpers";

export const load = async ({ locals, parent }) => {
  await parent()
  console.log("profile page")
  console.log(locals.user)

  if (locals.user == undefined) {
    redirectHelper('/login')
  }
  // route guard
  // user.subscribe((value) => {
  //   if (value == null) {
  //     redirectHelper('/')
  //   }
  // });

};
