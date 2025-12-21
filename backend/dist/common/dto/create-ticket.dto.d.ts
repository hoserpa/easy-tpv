import { CreateTicketLineDto } from './create-ticket-line.dto';
export declare class CreateTicketDto {
    lines: CreateTicketLineDto[];
    discount_type?: 'fixed' | 'percent' | null;
    discount_value?: number | null;
}
