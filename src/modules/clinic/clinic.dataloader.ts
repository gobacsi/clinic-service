import { Injectable } from '@nestjs/common';
import DataLoader from 'dataloader';
import { BaseDataLoader } from '../common/abstracts/base.dataloader';
import { ClinicModel } from './clinic.model';
import { ClinicService } from './clinic.service';

@Injectable()
export class ClinicLoader extends BaseDataLoader {
  private _loaderById: DataLoader<number, ClinicModel>;
  constructor(private readonly service: ClinicService) {
    super();
    this._loaderById = this.initLoader<number, ClinicModel>(this._getByIds.bind(this));
  }
  get loaderById() {
    return this._loaderById;
  }
  public initLoaderById(): DataLoader<number, ClinicModel> {
    return this.initLoader<number, ClinicModel>(this._getByIds);
  }
  private async _getByIds(ids: number[]): Promise<ClinicModel[]> {
    const data = await this.service.getByIds(ids);
    const batchMap = {};
    data.forEach((item) => {
      batchMap[item.id] = item;
    });
    return ids.map((id) => batchMap[id]);
  }
}
