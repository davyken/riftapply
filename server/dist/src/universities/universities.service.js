"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversitiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pdfParse = __importStar(require("pdf-parse"));
const university_schema_1 = require("./schemas/university.schema");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const enums_1 = require("../common/enums");
let UniversitiesService = class UniversitiesService {
    universityModel;
    cloudinaryService;
    constructor(universityModel, cloudinaryService) {
        this.universityModel = universityModel;
        this.cloudinaryService = cloudinaryService;
    }
    findAll() {
        return this.universityModel.find({ status: enums_1.AccountStatus.ACTIVE }).select('-password');
    }
    async findOne(id) {
        const uni = await this.universityModel.findById(id).select('-password');
        if (!uni)
            throw new common_1.NotFoundException('University not found');
        return uni;
    }
    async addModule(universityId, moduleData) {
        const uni = await this.universityModel.findById(universityId);
        if (!uni)
            throw new common_1.NotFoundException('University not found');
        uni.modules.push(moduleData);
        return uni.save();
    }
    async updateProfile(universityId, data, logo) {
        if (logo) {
            const result = await this.cloudinaryService.uploadFile(logo, 'universities/logos');
            data.logo = result.secure_url;
        }
        return this.universityModel
            .findByIdAndUpdate(universityId, data, { new: true })
            .select('-password');
    }
    async parsePrerequisitesPdf(file) {
        if (!file) {
            return [];
        }
        try {
            const parsed = await pdfParse(file.buffer);
            const text = parsed.text || '';
            const requirements = [];
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
        }
        catch (err) {
            console.error('PDF parsing error:', err);
            return ['Passport / National ID', 'High School Diploma', 'High School Transcript'];
        }
    }
};
exports.UniversitiesService = UniversitiesService;
exports.UniversitiesService = UniversitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(university_schema_1.University.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cloudinary_service_1.CloudinaryService])
], UniversitiesService);
//# sourceMappingURL=universities.service.js.map