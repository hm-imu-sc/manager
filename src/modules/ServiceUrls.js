import { endpoint } from "./Settings";


export const TagService = {
    deleteTag: `${endpoint}/delete_tag`,
    createTag: `${endpoint}/create_tag`,
    getAllTags: `${endpoint}/get_all_tags`,
    updateTag: `${endpoint}/update_tag`
}

export const StudyMaterialService = {
    deleteStudyMaterial: `${endpoint}/delete_study_material`,
    createStudyMaterial: `${endpoint}/create_study_material`,
    getAllStudyMaterials: `${endpoint}/get_all_study_materials`,
    updateStudyMaterial: `${endpoint}/update_study_material`
}