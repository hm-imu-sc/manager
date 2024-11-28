const endpoint = "http://192.168.0.4:8500";

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

export const TopicService = {
    deleteTopic: `${endpoint}/delete_topic`,
    createTopic: `${endpoint}/create_topic`,
    getAllTopics: `${endpoint}/get_all_topics`,
    updateTopic: `${endpoint}/update_topic`
}

export const CountService = {
    deleteCount: `${endpoint}/delete_count`,
    createCount: `${endpoint}/create_count`,
    getAllCounts: `${endpoint}/get_all_counts`,
    updateCounts: `${endpoint}/update_counts`
}