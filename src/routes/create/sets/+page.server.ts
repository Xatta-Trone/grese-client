import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message, setError } from 'sveltekit-superforms/server';
import { z } from 'zod'
import { user } from "$lib/services/auth";
import { redirectHelper } from "$lib/utils/helpers";
import axiosAPI from "$lib/services/customAxios";


const schema = z.object({
    visibility: z.number().default(1),
    name: z.string(),
    words: z.string(),
})
let folder_id: number | null = null

export const load: PageServerLoad = (async ({ url }) => {
    user.subscribe((value) => {
        console.log(value);
        if (value == null) {
            redirectHelper('/login')
        }
    });

    const tempFolderId: string | null = url.searchParams.get('folder_id')

    folder_id = tempFolderId ? parseInt(tempFolderId) : null

    const form = await superValidate(schema)

    return { form }
});


export interface ListCreateResponse {
    data: Data;
    message: string;
}

export interface Data {
    id: number;
    user_id: number;
    name: string;
    url: null | string;
    words: null | string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
}

export interface ListCreateErrorResponse {
    errors?: Errors;
}

export interface Errors {
    name?: string;
    url?: string;
    words?: string;
    visibility?: string;
}



export const actions: Actions = {
    default: async ({ request }) => {
        // Use superValidate in form actions too, but with the request
        const form = await superValidate(request, schema);
        console.log('POST', form);

        // Convenient validation check:
        if (!form.valid) {
            // Again, always return { form } and things will just work.
            return fail(400, { form });
        }

        // check words length
        let length = 0

        form.data.words.split('\n').forEach(wordLine => {
            wordLine.split(",").forEach(() => {
                length = length + 1
            })
        });

        if (length < 5) {
            setError(form, "words", "Please input at least 5 words.")
            return { form }
        }


        // TODO: Do something with the validated data
        // now submit the data 
        const data = { ...form.data, "scope": "user", folder_id }
        console.log(folder_id)

        await axiosAPI.post<ListCreateResponse>('/lists', data)
            .then((res) => {
                if (res.status == 201) {
                    const responseData: ListCreateResponse = res.data
                    console.log(responseData)
                    return message(form, responseData.message, { status: 201 });
                }

            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);

                    if (error.response.status == 422) {
                        // check for validation error 
                        const d: ListCreateErrorResponse = error.response.data

                        if (d.errors?.name) {
                            setError(form, "name", d.errors?.name)
                        }

                        if (d.errors?.words) {
                            setError(form, "words", d.errors?.words)
                        }

                        if (d.errors?.visibility) {
                            setError(form, "visibility", d.errors?.visibility)
                        }

                        return { form }

                    } else {
                        // setError(form, '', error.response.data.errors)
                        return message(form, error.response.data.errors, {
                            status: 400
                        });
                        // return message(form, 'error.response.data.errors', { status: 400 })
                    }

                }
            });

        // return message(form, 'asdf')

        // Yep, return { form } here too
        return { form };

    }

};