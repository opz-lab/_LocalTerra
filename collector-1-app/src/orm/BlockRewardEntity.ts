import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm'

import BlockEntity from './BlockEntity'

@Entity('blockreward')
export default class BlockRewardEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'jsonb' })
  reward: object

  @Column({ type: 'jsonb' })
  commission: object

  @Column({ type: 'jsonb' })
  rewardPerVal: object

  @Column({ type: 'jsonb' })
  commissionPerVal: object

  @OneToOne(() => BlockEntity, (block) => block.reward, { onDelete: 'CASCADE' })
  @JoinColumn()
  block: BlockEntity
}
