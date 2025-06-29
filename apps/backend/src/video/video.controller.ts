import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoService } from './video.service';
import { ReceiveTranscriptDto } from './dto/receive-transcript.dto';

@Controller('videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post()
  async create(@Body() dto: CreateVideoDto) {
    return this.videoService.create(dto.url);
  }

  @Get()
  async findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Get(':id/results')
  async results(@Param('id') id: string) {
    return this.videoService.getResults(id);
  }

  @Post(':id/transcript')
  async receiveTranscript(
    @Param('id') id: string,
    @Body() dto: ReceiveTranscriptDto,
  ) {
    await this.videoService.createTranscript(id, dto.text, dto.words);
    await this.videoService.updateVideoStatus(id, 'transcribed');
    return { ok: true };
  }
}
