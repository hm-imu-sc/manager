import { endpoint } from "./Settings";


export const TagService = {
    deleteTag: `${endpoint}/delete_tag`,
    createTag: `${endpoint}/create_tag`,
    getAllTags: `${endpoint}/get_all_tags`,
    updateTag: `${endpoint}/update_tag`
}
