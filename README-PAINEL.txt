PORTFÓLIO COM PAINEL DE WRITE-UPS

O site funciona em modo demonstração sem configuração. Para ativar o painel e salvar conteúdo:

1) Crie um projeto gratuito no Supabase.
2) Abra SQL Editor, cole todo o conteúdo de supabase.sql e execute.
3) Em Authentication > Users, crie seu usuário com e-mail e senha.
4) Em Project Settings > API, copie:
   - Project URL
   - anon public key
5) Abra config.js e substitua os dois textos de exemplo.
6) Envie todos os arquivos e pastas para a raiz do repositório GitHub.
7) Acesse o painel por:
   https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/loginzinho/

IMPORTANTE
- Não existe link para /loginzinho/ no site público.
- O nome escondido não é proteção. A segurança vem do Supabase Auth e das políticas RLS.
- A chave anon do Supabase pode ficar no site; nunca coloque service_role no GitHub.
- Para atualizar o código pelo site do GitHub, use Add file > Upload files e substitua os arquivos.
