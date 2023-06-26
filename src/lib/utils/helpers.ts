/** @format */

import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { redirect } from "@sveltejs/kit";
import { INTENDED_KEY } from "./constants";

export function redirectHelper(to = '/', u?: URL) {
    // const url = `${to}?${redirectTo != "/" ? "intended=" + redirectTo : ""}`;

    if (browser && u != undefined) {
        localStorage.setItem(INTENDED_KEY, u.pathname + u.search)
    }


    if (browser) {
        goto(to);
    } else {
        throw redirect(301, to);
    }
}

