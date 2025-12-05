import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';

@Injectable()
export class AiService {
  private aiServiceUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.aiServiceUrl = this.configService.get<string>(
      'AI_SERVICE_URL',
      'http://localhost:8002',
    );
  }

  async detectCounterfeit(imageBuffer: Buffer, filename: string) {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename });

    try {
      const response = await axios.post(
        `${this.aiServiceUrl}/detect`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('AI Service unavailable');
    }
  }
}
