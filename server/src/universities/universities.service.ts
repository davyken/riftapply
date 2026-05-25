import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as pdfParse from 'pdf-parse';
import { University, UniversityDocument } from './schemas/university.schema';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AccountStatus } from '../common/enums';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University.name) private universityModel: Model<UniversityDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  findAll() {
    return this.universityModel.find({ status: AccountStatus.ACTIVE }).select('-password');
  }

  async findOne(id: string) {
    const uni = await this.universityModel.findById(id).select('-password');
    if (!uni) throw new NotFoundException('University not found');
    return uni;
  }

  async addModule(universityId: string, moduleData: any) {
    const uni = await this.universityModel.findById(universityId);
    if (!uni) throw new NotFoundException('University not found');
    uni.modules.push(moduleData);
    return uni.save();
  }

  async updateProfile(universityId: string, data: any, logo?: Express.Multer.File) {
    if (logo) {
      const result = await this.cloudinaryService.uploadFile(logo, 'universities/logos');
      data.logo = result.secure_url;
    }
    return this.universityModel
      .findByIdAndUpdate(universityId, data, { new: true })
      .select('-password');
  }

  async parsePrerequisitesPdf(file: Express.Multer.File): Promise<string[]> {
    if (!file) {
      return [];
    }

    try {
      const parsed = await (pdfParse as any)(file.buffer);
      const text = parsed.text || '';

      const requirements: string[] = [];

      const docPatterns = [
        { name: 'Passport / National ID', patterns: [/passport/i, /national id/i, /identity card/i, /identification/i] },
        { name: 'High School Transcript', patterns: [/transcript/i, /marksheet/i, /academic record/i, /grade sheet/i] },
        { name: 'High School Diploma', patterns: [/diploma/i, /graduation certificate/i, /school certificate/i] },
        { name: 'English Proficiency Certificate', patterns: [/ielts/i, /toefl/i, /english proficiency/i, /duolingo english/i] },
        { name: 'Statement of Purpose (SOP)', patterns: [/statement of purpose/i, /personal statement/i, /motivation letter/i, /letter of intent/i] },
        { name: 'Letters of Recommendation', patterns: [/recommendation/i, /reference letter/i, /referee/i] },
        { name: 'Curriculum Vitae (CV) / Resume', patterns: [/cv/i, /resume/i, /curriculum vitae/i] },
        { name: 'Proof of Financial Funds', patterns: [/bank statement/i, /proof of funds/i, /financial support/i, /sponsorship/i] },
        { name: 'Medical Certificate', patterns: [/medical certificate/i, /health report/i, /vaccination/i] },
        { name: 'Portfolio', patterns: [/portfolio/i, /creative work/i] },
        { name: 'Birth Certificate', patterns: [/birth certificate/i] }
      ];

      for (const item of docPatterns) {
        const matches = item.patterns.some(p => p.test(text));
        if (matches) {
          requirements.push(item.name);
        }
      }

      const lines = text.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^[-*•\d.]+\s+(Copy of|Proof of|Original|Valid|Official|Certified|Upload)\s/i.test(trimmed)) {
          const clean = trimmed.replace(/^[-*•\d.\s]+/, '').trim();
          if (clean.length > 5 && clean.length < 80) {
            const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
            if (!requirements.includes(capitalized)) {
              requirements.push(capitalized);
            }
          }
        }
      }

      if (requirements.length === 0) {
        return ['Passport / National ID', 'High School Diploma', 'High School Transcript'];
      }

      return requirements;
    } catch (err) {
      console.error('PDF parsing error:', err);
      return ['Passport / National ID', 'High School Diploma', 'High School Transcript'];
    }
  }
}
