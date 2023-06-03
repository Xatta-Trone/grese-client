/** @format */
import { user } from "$lib/services/auth";
import { redirectHelper } from "$lib/utils/helpers";

export const load = () => {
  // route guard
  user.subscribe((value) => {
    if (value == null) {
      redirectHelper('/')
    }
  });

};
