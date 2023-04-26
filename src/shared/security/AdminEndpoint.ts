import { SetMetadata } from '@nestjs/common';
export const AdminEndpoint = () => SetMetadata('isAdmin', true);
