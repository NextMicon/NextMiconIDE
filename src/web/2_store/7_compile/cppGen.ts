export const cpp = {
  include: (path: string) => `#include "${path}"`,
  declaration: (type: string, name: string) => `extern ${type} ${name};`,
  instantiation: (type: string, name: string, init: string) => `${type} ${name}(${init});`,
};
