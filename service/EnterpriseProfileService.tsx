import { BaseService } from './BaseService';

export class EnterpriseProfileService extends BaseService {
    constructor() {
        super('/profile');
    }
}
