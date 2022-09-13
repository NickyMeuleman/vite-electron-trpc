import { createRouter } from "../context";
import { randomUUID } from "crypto";
import { z } from "zod";
export const exampleRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.example.findMany();
    },
  })
  .mutation("add", {
    async resolve({ ctx }) {
      return ctx.prisma.example.create({ data: { id: randomUUID() } });
    },
  })
  .mutation("remove", {
    input: z.object({ id: z.string().uuid() }),
    async resolve({ ctx, input }) {
      return ctx.prisma.example.delete({ where: { id: input.id } });
    },
  });
