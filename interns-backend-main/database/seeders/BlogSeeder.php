<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blogPosts = [
            [
                'title' => 'Getting Started with Modern Web Development',
                'author' => 'Hawi Software Team',
                'category' => 'Web Development',
                'status' => 'Published',
                'image_url' => 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
                'content' => 'Web development has evolved significantly over the years. Today, we have powerful frameworks and tools that make building modern web applications faster and more efficient than ever before. In this comprehensive guide, we\'ll explore the latest trends and technologies in web development, including React, Vue.js, and modern CSS frameworks. We\'ll also discuss best practices for responsive design, performance optimization, and user experience. Whether you\'re a beginner or an experienced developer, this article will provide valuable insights into the current state of web development.',
                'views' => 1250,
                'likes' => 45,
                'publish_date' => now()->subDays(5)->toDateString(),
            ],
            [
                'title' => 'The Future of Mobile App Development',
                'author' => 'Hawi Software Team',
                'category' => 'Mobile Development',
                'status' => 'Published',
                'image_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
                'content' => 'Mobile app development continues to be one of the most dynamic fields in technology. With the rise of cross-platform frameworks like React Native and Flutter, developers can now build apps that work seamlessly across iOS and Android platforms. This article explores the latest trends in mobile development, including AI integration, augmented reality features, and the growing importance of app security. We\'ll also discuss the challenges and opportunities in the mobile app market, and provide tips for creating successful mobile applications.',
                'views' => 980,
                'likes' => 32,
                'publish_date' => now()->subDays(3)->toDateString(),
            ],
            [
                'title' => 'Software Architecture Best Practices',
                'author' => 'Hawi Software Team',
                'category' => 'Software Architecture',
                'status' => 'Published',
                'image_url' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
                'content' => 'Good software architecture is the foundation of any successful software project. It determines how well your application will scale, perform, and maintain over time. In this article, we\'ll discuss key principles of software architecture, including modularity, scalability, and maintainability. We\'ll explore different architectural patterns such as microservices, monolithic architecture, and serverless computing. We\'ll also provide practical examples and case studies to help you understand how to apply these concepts in real-world projects.',
                'views' => 750,
                'likes' => 28,
                'publish_date' => now()->subDays(7)->toDateString(),
            ],
            [
                'title' => 'UI/UX Design Trends for 2024',
                'author' => 'Hawi Software Team',
                'category' => 'Design',
                'status' => 'Published',
                'image_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
                'content' => 'User interface and user experience design are constantly evolving fields that play a crucial role in the success of digital products. In 2024, we\'re seeing exciting new trends that focus on accessibility, sustainability, and user-centered design. This article covers the latest UI/UX trends including dark mode design, micro-interactions, voice user interfaces, and inclusive design principles. We\'ll also discuss the importance of user research and testing in creating effective designs that truly serve the needs of your users.',
                'views' => 1100,
                'likes' => 41,
                'publish_date' => now()->subDays(2)->toDateString(),
            ],
            [
                'title' => 'DevOps and Continuous Integration',
                'author' => 'Hawi Software Team',
                'category' => 'DevOps',
                'status' => 'Published',
                'image_url' => 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop',
                'content' => 'DevOps practices have revolutionized how software is developed, tested, and deployed. By breaking down silos between development and operations teams, organizations can achieve faster delivery cycles and higher quality software. This article explores the key concepts of DevOps, including continuous integration, continuous deployment, infrastructure as code, and monitoring. We\'ll also discuss popular DevOps tools and platforms, and provide practical tips for implementing DevOps practices in your organization.',
                'views' => 850,
                'likes' => 35,
                'publish_date' => now()->subDays(4)->toDateString(),
            ],
            [
                'title' => 'Cybersecurity in Software Development',
                'author' => 'Hawi Software Team',
                'category' => 'Security',
                'status' => 'Published',
                'image_url' => 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
                'content' => 'Security should be a top priority in every stage of software development. With the increasing number of cyber threats and data breaches, developers need to be proactive about implementing security measures. This article covers essential security practices for software development, including secure coding practices, authentication and authorization, data encryption, and vulnerability assessment. We\'ll also discuss common security vulnerabilities and how to prevent them, as well as the importance of regular security audits and updates.',
                'views' => 920,
                'likes' => 38,
                'publish_date' => now()->subDays(6)->toDateString(),
            ],
        ];

        foreach ($blogPosts as $post) {
            Blog::create($post);
        }
    }
}

