/** @format */

import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { redirect } from "@sveltejs/kit";

export function redirectHelper(to = '/', redirectTo = "/") {
    const url = `${to}?${redirectTo != "/" ? "intended=" + redirectTo : ""}`;

    if (browser) {
        goto(url);
    } else {
        throw redirect(301, url);
    }
}

