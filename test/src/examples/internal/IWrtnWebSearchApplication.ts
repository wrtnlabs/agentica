export interface IWrtnWebSearchApplication {
  /**
   * Perform a web search.
   *
   * Find relevant information from the web based on the provided search
   * parameters.
   */
  search: (props: IWrtnWebSearchApplication.IProps) => Promise<void>;
}

export namespace IWrtnWebSearchApplication {
  export interface IProps {
    /**
     * Keyword to search on the web.
     */
    keyword: string;
  }
}
