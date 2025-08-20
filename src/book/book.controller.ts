import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UpdateBookDto } from "./dto/update-book.dto";

@Controller()
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @ApiOperation({ summary: 'Criar um novo livro' })
    @ApiResponse({ status: 201, description: 'Livro criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    create(@Body() data: CreateBookDto) {
        return this.bookService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os livros' })
    @ApiResponse({ status: 200, description: 'Lista de livros retornada com sucesso.' })
    @ApiResponse({ status: 404, description: 'Nenhum livro encontrado.' })
    findAll() {
        return this.bookService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obter um livro por ID' })
    @ApiResponse({ status: 200, description: 'Livro encontrado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
    findById(@Param('id') id: string) {
        return this.bookService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um livro por ID' })
    @ApiResponse({ status: 200, description: 'Livro atualizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
    update(@Body('id') id: string, @Body() data: UpdateBookDto) {
        return this.bookService.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um livro por ID' })
    @ApiResponse({ status: 200, description: 'Livro deletado com sucesso.'})
    @ApiResponse({ status: 404, description: 'Livro não encontrado.' })
    delete(@Param('id') id: string) {
        return this.bookService.delete(id);
    }
}