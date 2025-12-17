import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShortsService } from './shorts.service';

@Controller('shorts')
export class ShortsController {
    constructor(private readonly shortsService: ShortsService) { }

    @Post()
    create(@Body() createShortDto: any) {
        return this.shortsService.create(createShortDto);
    }

    @Get()
    findAll() {
        return this.shortsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.shortsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateShortDto: any) {
        return this.shortsService.update(id, updateShortDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.shortsService.remove(id);
    }
}
