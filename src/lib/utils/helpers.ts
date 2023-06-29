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

export function timeSince(date: Date) {

    const seconds: number = Math.floor(((new Date()).getTime() - date.getTime()) / (1000));

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}