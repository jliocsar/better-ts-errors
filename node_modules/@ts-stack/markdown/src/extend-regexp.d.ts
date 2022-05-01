export declare class ExtendRegexp {
    private source;
    private flags;
    constructor(regex: RegExp, flags?: string);
    /**
     * Extend regular expression.
     *
     * @param groupName Regular expression for search a group name.
     * @param groupRegexp Regular expression of named group.
     */
    setGroup(groupName: RegExp | string, groupRegexp: RegExp | string): this;
    /**
     * Returns a result of extending a regular expression.
     */
    getRegexp(): RegExp;
}
