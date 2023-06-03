/** @format */
import { user } from "$lib/services/auth";
import { redirect } from "@sveltejs/kit";

export const load = () => {
  // route guard
  user.subscribe((value) => {
    console.log(value);
    if (value == null) {
      throw redirect(301, "/login");
    }
  });
};
