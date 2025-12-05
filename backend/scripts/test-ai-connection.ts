import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AiService } from '../src/ai/ai.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const aiService = app.get(AiService);

    console.log('Testing AI Service Connection...');

    // Create a dummy image buffer
    const buffer = Buffer.from('fake image data');

    try {
        // We expect this to fail with "Invalid image data" or similar from the AI service, 
        // but if it connects, that counts as success for connectivity.
        // Or we can try to hit the health endpoint if the service exposed it publicly, 
        // but AiService only has detectCounterfeit.
        // Let's try detectCounterfeit and catch the specific error.

        // Actually, let's just check if we can reach the health endpoint using axios directly 
        // to verify connectivity first, as detectCounterfeit requires a valid image to not 400.
        // But the requirement is "backend to the AI", so using the service method is better.
        // We will use a small valid 1x1 pixel png to avoid "Invalid image data" error if possible,
        // or just accept the 400 as proof of connection.

        // 1x1 pixel PNG base64
        const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
        const validBuffer = Buffer.from(base64Png, 'base64');

        const result = await aiService.detectCounterfeit(validBuffer, 'test.png');
        console.log('AI Service Response:', result);
        console.log('SUCCESS: Backend is connected to AI Service.');
    } catch (error) {
        if (error.message.includes('AI Service unavailable')) {
            console.error('FAILURE: Could not connect to AI Service.');
            console.error('Make sure the AI service is running on port 8002.');
        } else {
            // If we got a response (even 400 or 500), it means we connected.
            console.log('SUCCESS: Backend connected to AI Service (received response).');
            console.log('Response Error (expected for dummy data):', error.message);
        }
    }

    await app.close();
}

bootstrap();
