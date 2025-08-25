import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { $Enums, book } from "@prisma/client";
import { categoriaLivro } from '@prisma/client';

@Injectable()
export class BookService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateBookDto) {
        const bookExist = await this.prisma.book.findUnique({
            where: { titulo: data.titulo }
        })

        if (bookExist) {
            throw new ConflictException("Livro já cadastrado!")
        }

        const newBook = await this.prisma.book.create({
            data: {
                titulo: data.titulo,
                autor: data.autor,
                DataPublicacao: data.dataPublicacao,
                categoria: data.categoria?.toUpperCase() as categoriaLivro
            }
        })

        return newBook
    }

    async findAll(): Promise<book[]> {
        return this.prisma.book.findMany()
    }

    async findById(id: string): Promise<book | null> {
        const founderBook = await this.prisma.book.findUnique({
            where: { id }
        })

        if (!founderBook) {
            throw new NotFoundException(`
                
                Livro com id ${id} não identificado
                
                `)
        }

        return founderBook
    }

    async update(id: string, data: UpdateBookDto) {
        const book = await this.prisma.book.findUnique({ where: { id } });

        if (!book) {
            throw new NotFoundException(`Livro com id ${id} não identificado`);    
        }

        return this.prisma.book.update({
            where: { id },
            data: { ...data, categoria: data.categoria?.toUpperCase() as categoriaLivro },
        });
    }

    async delete(id: string): Promise<book | null> {
        try {
            return await this.prisma.book.delete({ where: { id } })
        } catch {
            throw new NotFoundException(`

                Livro com id ${id} não identificado
                
                `)
        }
    }
}