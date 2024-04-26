import prisma from './client.js';
import fs from 'fs';

(async () => {
  try {
    const folder = await prisma.folder.create({
      data: {
        files: {
          create: [
            {
              url: 'one',
            },
            {
              url: 'one',
            },
            {
              url: 'one',
            },
            {
              url: 'one',
            },
          ],
        },
        folders: {
          create: [
            {
              files: {
                create: {
                  url: 'test',
                },
              },
              folders: {
                create: {
                  folders: {
                    create: {
                      folders: {
                        create: {
                          folders: {
                            create: {
                              files: {
                                create: {
                                  url: 'test 3',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              files: {
                create: {
                  url: 'test',
                },
              },
            },
          ],
        },
      },
      include: {
        files: true,
        folders: {
          include: {
            files: true,
            folders: {
              include: {
                files: true,
                folders: {
                  include: {
                    files: true,
                    folders: {
                      include: {
                        files: true,
                        folders: {
                          include: {
                            files: true,
                            folders: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    fs.writeFileSync('test.json', JSON.stringify(folder));
  } catch (err) {
    console.log(err);
  }
})();
