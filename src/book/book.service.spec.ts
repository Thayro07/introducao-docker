import { Test } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  book: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('BookService - testes completos', () => {
  let service: BookService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        BookService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = moduleRef.get<BookService>(BookService);
  });

  it('deve criar um livro se não existir', async () => {
    const dadosLivro = { 
      titulo: '1984', 
      autor: 'George Orwell', 
      dataPublicacao: new Date('1949-06-08'), 
      categoria: 'FICTION' 
    };
    mockPrismaService.book.findUnique.mockResolvedValue(null);
    mockPrismaService.book.create.mockResolvedValue({ id: '1', ...dadosLivro });

    const resultado = await service.create(dadosLivro as any);

    expect(resultado).toEqual({ id: '1', ...dadosLivro });
  });

  it('deve lançar ConflictException se o livro já existir', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue({ id: '1', titulo: 'Dom Casmurro' } as any);

    await expect(service.create({ 
      titulo: 'Dom Casmurro', 
      autor: 'Machado de Assis', 
      dataPublicacao: new Date('1899-01-01'), 
      categoria: 'CLASSIC' 
    } as any)).rejects.toThrow(ConflictException);
  });

  it('deve listar todos os livros', async () => {
    const livros = [
      { 
        id: '1', 
        titulo: 'Grande Sertão: Veredas', 
        autor: 'João Guimarães Rosa', 
        dataPublicacao: new Date('1956-01-01'), 
        categoria: 'CLASSIC' 
      },
      { 
        id: '2', 
        titulo: 'Cem Anos de Solidão', 
        autor: 'Gabriel García Márquez', 
        dataPublicacao: new Date('1967-05-30'), 
        categoria: 'MAGICAL_REALISM' 
      }
    ];
    mockPrismaService.book.findMany.mockResolvedValue(livros);

    const resultado = await service.findAll();

    expect(resultado).toEqual(livros);
  });

  it('deve buscar livro por id', async () => {
    const livro = { 
      id: '1', 
      titulo: 'O Senhor dos Anéis', 
      autor: 'J.R.R. Tolkien', 
      dataPublicacao: new Date('1954-07-29'), 
      categoria: 'FANTASY' 
    };
    mockPrismaService.book.findUnique.mockResolvedValue(livro);

    const resultado = await service.findById('1');

    expect(resultado).toEqual(livro);
  });

  it('deve lançar NotFoundException ao buscar livro inexistente', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue(null);

    await expect(service.findById('999')).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar um livro existente', async () => {
    const livroAtual = {
      id: '1',
      titulo: 'O Hobbit',
      autor: 'J.R.R. Tolkien',
      dataPublicacao: new Date('1937-09-21'),
      categoria: 'FANTASY'
    };
    const dadosAtualizados = { 
      titulo: 'O Hobbit - Edição Revisada', 
      autor: 'J.R.R. Tolkien', 
      dataPublicacao: new Date('1951-01-01'), 
      categoria: 'FANTASY' 
    };
    mockPrismaService.book.findUnique.mockResolvedValue(livroAtual);
    mockPrismaService.book.update.mockResolvedValue({ ...livroAtual, ...dadosAtualizados });

    const resultado = await service.update('1', dadosAtualizados as any);

    expect(resultado.titulo).toBe('O Hobbit - Edição Revisada');
  });

  it('deve lançar NotFoundException ao atualizar livro inexistente', async () => {
    mockPrismaService.book.findUnique.mockResolvedValue(null);

    await expect(service.update('999', { titulo: 'Livro Fantasma' } as any)).rejects.toThrow(NotFoundException);
  });

  it('deve deletar um livro existente', async () => {
    const livro = { 
      id: '1', 
      titulo: 'A Revolução dos Bichos', 
      autor: 'George Orwell', 
      dataPublicacao: new Date('1945-08-17'), 
      categoria: 'FICTION' 
    };
    mockPrismaService.book.delete.mockResolvedValue(livro);

    const resultado = await service.delete('1');

    expect(resultado).toEqual(livro);
  });

  it('deve lançar NotFoundException ao deletar livro inexistente', async () => {
    mockPrismaService.book.delete.mockRejectedValue(new Error('não encontrado'));

    await expect(service.delete('999')).rejects.toThrow(NotFoundException);
  });
});
