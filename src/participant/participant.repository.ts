import { EntityRepository, Repository } from 'typeorm';

import { Participant } from './participant.entity';

@EntityRepository(Participant)
export class ParticipantRepository extends Repository<Participant> {}
