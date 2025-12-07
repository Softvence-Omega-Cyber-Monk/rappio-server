import { PartialType } from '@nestjs/swagger';
import { CreateR2WorkerDto } from './create-r2-worker.dto';

export class UpdateR2WorkerDto extends PartialType(CreateR2WorkerDto) {}
