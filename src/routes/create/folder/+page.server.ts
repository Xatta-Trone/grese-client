import { user } from '$lib/services/auth';
import { redirectHelper } from '$lib/utils/helpers';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod'
import { fail, redirect } from '@sveltejs/kit';
import axiosAPI from '$lib/services/customAxios';



const schema = z.object({
    name: z.string(),
    visibility: z.number().default(1)
})

export const load = (async () => {
    user.subscribe((value) => {
        console.log(value);
        if (value == null) {
            redirectHelper('/login')
        }
    });
    const form = await superValidate(schema)

    return { form }
}) satisfies PageServerLoad;

export interface FolderCreateSuccessResponse {
    data: Data;
    message: string;
}

export interface Data {
    id: number;
    user_id: number;
    list_meta_id: null;
    name: string;
    slug: string;
    visibility: number;
    status: number;
    crated_at: Date;
    updated_at: Date;
}

export interface FolderCreateErrorResponse {
    errors?: Errors;
}

export interface Errors {
    name?: string;
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

        // TODO: Do something with the validated data
        // now submit the data 
        const data = { ...form.data, }

        await axiosAPI.post<FolderCreateSuccessResponse>('/folders', data)
            .then((res) => {
                if (res.status == 201) {
                    const responseData: FolderCreateSuccessResponse = res.data
                    console.log(responseData)
                    // return redirectHelper('/create/sets?folder_id=' + responseData.data.id)
                    return message(form, responseData.message, { status: 201 });
                }

            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);

                    if (error.response.status == 422) {
                        // check for validation error 
                        const d: FolderCreateErrorResponse = error.response.data

                        if (d.errors?.name) {
                            setError(form, "name", d.errors?.name)
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
