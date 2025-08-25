import { Test, TestingModule } from "@nestjs/testing";
import { BookController } from "./book.controller";
import { BookService } from "./book.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { NotFoundException } from "@nestjs/common";

const mockBookService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

describe("Book Controller Test", () => {
    let controller: BookController;
    let service: BookService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookController],
            providers: [
                {
                    provide: BookService,
                    useValue: mockBookService,
                },
            ],
        }).compile();

        controller = module.get<BookController>(BookController);
        service = module.get<BookService>(BookService);
    });

    it("deve criar um livro", async () => {
        const createBookDto: CreateBookDto = {
            titulo: "Dom Casmurro",
            autor: "Machado de Assis",
            categoria: "ROMANCE",
        };
        const result = { id: "1", ...createBookDto };
        mockBookService.create.mockResolvedValue(result);

        expect(await controller.create(createBookDto)).toEqual(result);
        expect(mockBookService.create).toHaveBeenCalledWith(createBookDto);
    });

    it("listar todos os livros", async () => {
        const result = [
            { id: "1", titulo: "Cem Anos de Solidão", autor: "Gabriel García Márquez", categoria: "REALISMO MÁGICO" },
        ];
        mockBookService.findAll.mockResolvedValue(result);

        expect(await controller.findAll()).toEqual(result);
        expect(mockBookService.findAll).toHaveBeenCalled();
    });

    it("buscar livro por id", async () => {
        const book = { id: "1", titulo: "A Revolução dos Bichos", autor: "George Orwell", categoria: "FICÇÃO POLÍTICA" };
        mockBookService.findById.mockResolvedValue(book);

        expect(await controller.findById("1")).toEqual(book);
        expect(mockBookService.findById).toHaveBeenCalledWith("1");
    });

    it("deve lançar NotFoundException se o livro não for encontrado", async () => {
        mockBookService.findById.mockRejectedValue(new NotFoundException("Livro não encontrado"));

        await expect(controller.findById("id não existente")).rejects.toThrow(NotFoundException);
    });

    it("deve atualizar um livro", async () => {
        const updateBookDto: UpdateBookDto = {
            titulo: "1984 - Edição Especial",
            autor: "George Orwell",
            categoria: "DISTOPIA",
        };
        const result = { id: "1", ...updateBookDto };
        mockBookService.update.mockResolvedValue(result);

        expect(await controller.update("1", updateBookDto)).toEqual(result);
        expect(mockBookService.update).toHaveBeenCalledWith("1", updateBookDto);
    });

    it("deve lançar NotFoundException ao atualizar livro por id inexistente", async () => {
        mockBookService.update.mockRejectedValue(new NotFoundException());

        await expect(controller.update("999", { titulo: "A Metamorfose" } as any)).rejects.toThrow(NotFoundException);
    });

    it("deve deletar um livro", async () => {
        const bookId = "1";
        mockBookService.delete.mockResolvedValue({ id: bookId });

        expect(await controller.delete(bookId)).toEqual({ id: bookId });
        expect(mockBookService.delete).toHaveBeenCalledWith(bookId);
    });
});
