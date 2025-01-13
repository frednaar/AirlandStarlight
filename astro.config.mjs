// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog'

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			plugins: [starlightBlog(
			{
				authors: {
					fred:{
					name: 'FredAirland',
					title: 'Gameplay Developer',
					picture:'https://github.com/frednaar.png'
					},
					laco:{
					name: 'Laco',
					title: 'Developer, Core Engine & Sandbox',
					picture: 'https://media.licdn.com/dms/image/v2/C4D03AQFKUKGf9DqQXg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1620200137922?e=1741219200&v=beta&t=YlHgarSh35uRM2fJHBnJEs0mtdrD9aZoXF3eS4tYRlc'									
					},	
					peter:{
						name: 'Peter',
						title: 'Developer, Procedural Planet',
						picture:'https://media.licdn.com/dms/image/v2/C4E03AQF07Cic_RYMrg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1653122642016?e=1741219200&v=beta&t=XjgzKClJp79xXNw7gAuwdmHbKPOMm2lAE-PLineZ7dw'
						},
	

					},

			}



			)],
			title: 'Welcome to Airland World',

			customCss: [
				// Relative path to your custom CSS file
				'./src/styles/custom.css',
			  ],

			logo:{
				src:'./src/assets/airlandlight.png',
			replacesTitle: true,},
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', slug: 'guides/example' },
				// 	],
				// },
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
				{
					label: 'Documentation',
					autogenerate: { directory: 'AWIntro' },
				},
				{
					label: 'How to Play Airland World',
					autogenerate: { directory: 'AWHowToPlay' },
				},
				{
					label: 'Airland World for Creators',
					autogenerate: { directory: 'AWCreators' },
				},
				{
					label: 'Introduction to LUAU',
					autogenerate: { directory: 'AWLuau' },
					collapsed: true,
				},
			],
		}),
	],
});
