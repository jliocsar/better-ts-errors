export const TYPESCRIPT_SNIPPET_REGEX = /(?<=('(\b)?))(?:(?=(\\?))\2.)*?(?=\1)/g
export const TYPESCRIPT_ERROR_BOUNDARY = /(?<!\.)\.(?!\.)/g
export const OBJECT_PROPERTIES_AND_REGEX = /\s\d+\s/gi
export const PROPERTIES_LIST_REGEX = /:\s(.+),?$/
