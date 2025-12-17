import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Short, ShortDocument } from './schemas/short.schema';

@Injectable()
export class ShortsService {
    constructor(@InjectModel(Short.name) private shortModel: Model<ShortDocument>) { }

    async create(createShortDto: any): Promise<Short> {
        const newShort = new this.shortModel(createShortDto);
        return newShort.save();
    }

    async findAll(): Promise<Short[]> {
        return this.shortModel.find().sort({ createdAt: -1 }).exec();
    }

    async findOne(id: string): Promise<Short> {
        const short = await this.shortModel.findById(id).exec();
        if (!short) throw new NotFoundException('Short video not found');
        return short;
    }

    async update(id: string, updateShortDto: any): Promise<Short> {
        const updatedShort = await this.shortModel
            .findByIdAndUpdate(id, updateShortDto, { new: true })
            .exec();
        if (!updatedShort) throw new NotFoundException('Short video not found');
        return updatedShort;
    }

    async remove(id: string): Promise<any> {
        const deletedShort = await this.shortModel.findByIdAndDelete(id).exec();
        if (!deletedShort) throw new NotFoundException('Short video not found');
        return deletedShort;
    }
}
