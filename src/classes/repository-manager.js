import Axios from '../helpers';
/**
 * A class for repository management.
 */
class RepositoryManager {
  /**
   * Constructor for Repository Manager class
   * @param { object } options for the repository manager
   */
  constructor(options) {
    this.axios = Axios.createInstance(options);
  }

  /**
   * Get an list of available repositories.
   * @throws Error
   */
  getRepositories() {
    const request = this.axios.get('repositories');
    request.then( (response) => {
      console.log(response.data);
      // return response.data;
    }, (err) => {
      console.error(err);
      // throw err;
    });
  }
}

export default RepositoryManager;
