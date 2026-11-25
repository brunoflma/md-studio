# Orientação Web no MD Studio

## Uso consultivo

Antes de alterar HTML, CSS ou JavaScript, consulte o [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance?hl=pt-br) e o [guia de adoção](https://developer.chrome.com/docs/modern-web-guidance/get-started?hl=pt-br). Use **Baseline Widely Available** como alvo inicial, detecção de recursos e melhoria progressiva quando houver incompatibilidade. Uma recomendação externa é evidência para revisão, não permissão para mudar o contrato do produto.

Não instale componentes globais, não adicione dependências ao produto e não execute refatoração automática nem scanner obrigatório no CI. Primeiro descreva o problema observado, consulte o guia específico e proponha uma mudança pequena. Preserve aparência, privacidade, comportamento e testes existentes. Não afirme melhora de desempenho sem medir antes e depois.

## Escopo e critérios

- Aplicativo: `md-studio.html`, aberto diretamente por `file://`; site de apresentação: `docs/index.html`.
- Preserve o HTML único e a operação offline. Não introduza CDN, fonte remota, servidor obrigatório ou envio de documentos para a rede.
- Abra um Markdown sintético com título, tabela, código e fórmula sem conexão. Alterne leitura, edição visual e código; confira preservação do conteúdo e exportação. Reabra o arquivo exportado para verificar o resultado, não apenas a mensagem de sucesso.
- Exercite abrir arquivo e arrastar/soltar separadamente. Quando uma API de arquivo não existir, mantenha o seletor/download alternativo; não torne uma API exclusiva do Chrome obrigatória.
- Confira foco, ordem de Tab, atalhos documentados, nomes acessíveis, retorno de foco ao fechar uma sobreposição e zoom de 200%.
- No site, confira os três modos, exemplo copiável e links de download em 320, 390 e 1440 px, também com JavaScript desativado quando aplicável.
- Execute `node .app/scripts/verify-site.cjs`. Esse verificador confere a apresentação estática, mas não comprova a edição offline nem compatibilidade de navegador.

## Evidência de aceitação

Registre commit, caminho/URL, cenário, navegador, viewport e resultado. Separe teste estático, automação de navegador e avaliação manual. Chrome/Edge, Firefox e Safari fazem parte da matriz; emulação de viewport e Playwright WebKit não comprovam Safari em iPhone real. Use apenas arquivos e perfis sintéticos. A presença desta orientação não é evidência de uma auditoria concluída nem autorização para publicar.
