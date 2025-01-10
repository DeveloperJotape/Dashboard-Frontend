import { BaseService } from './BaseService';

export class ProfileUserService extends BaseService {
    constructor() {
        super('/profile');
    }
}
